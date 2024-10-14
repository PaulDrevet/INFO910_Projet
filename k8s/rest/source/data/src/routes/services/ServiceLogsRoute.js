"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const Main_1 = __importDefault(require("../../Main"));
class ServiceLogsRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const { containerName } = req.params;
            const { html, length } = req.query;
            const servicesName = await Main_1.default.docker().getDocker().listServices().then(services => services.map(service => service.Spec?.Name));
            console.log(servicesName);
            const container = await Main_1.default.docker().getContainers().getByName(containerName);
            if (!container) {
                reply.code(404).send({ error: "Service not found" });
                return;
            }
            reply.header('Content-Type', 'text/event-stream');
            reply.header('Access-Control-Allow-Origin', '*');
            reply.raw.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*'
            });
            getLogs(reply.raw, container, containerName, html, length);
            getStats(reply.raw, container);
        };
    }
}
exports.default = ServiceLogsRoute;
async function getLogs(res, container, containerName, html, requestedLength) {
    container.logs({
        details: true,
        follow: true,
        stdout: true,
        stderr: true,
        tail: requestedLength ?? 30
    }, function (err, stream) {
        if (err) {
            console.error(err);
            return;
        }
        if (!stream)
            return;
        let lastCode = '';
        stream.on('data', chunk => {
            let data = chunk.toString().replace(/\r/g, '').replace(/\n/g, '').replace(/>/g, '');
            data = data.slice(data.indexOf(' '));
            const matchTime = data.match(/(?:\[[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d [a-z]*]: )/gi);
            if (matchTime?.length) {
                data = data.substring(data.split(matchTime[0])[0].length);
            }
            res.write('event: log\ndata: ' + data + '\n\n', 'utf-8');
        });
        stream.on('end', () => {
            let retry = 0;
            let interval = setInterval(async () => {
                if (retry >= 5) {
                    clearInterval(interval);
                    res.end();
                    return;
                }
                retry++;
                const retryContainer = await Main_1.default.docker().getContainers().getByName(containerName);
                if (!retryContainer)
                    return;
                clearInterval(interval);
                stream.pause();
                await getLogs(res, retryContainer, containerName, html, requestedLength);
            }, 5000);
        });
    });
}
async function getStats(res, container) {
    const statsStream = await container.stats({ stream: true });
    statsStream.on('data', chunk => {
        const stats = JSON.parse(chunk.toString());
        // Extraire les informations de CPU et de mémoire
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
        const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        const cpuUsage = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100.0;
        const memoryUsage = stats.memory_stats.usage;
        const memoryLimit = stats.memory_stats.limit;
        const memoryPercent = (memoryUsage / memoryLimit) * 100.0;
        const statsMessage = {
            cpu: cpuUsage.toFixed(2),
            memory: {
                usage: (memoryUsage / 1024 / 1024).toFixed(2),
                percent: memoryPercent.toFixed(2)
            }
        };
        res.write(`event: stats\ndata: ${statsMessage.toString()}\n\n`, 'utf-8');
    });
    statsStream.on('end', () => {
        res.end();
    });
}
