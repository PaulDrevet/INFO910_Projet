import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private lengthSubject = new BehaviorSubject<number>(10);
  private specialSubject = new BehaviorSubject<boolean>(false);
  private numbersSubject = new BehaviorSubject<boolean>(true);
  private uppercaseSubject = new BehaviorSubject<boolean>(true);
  private lowercaseSubject = new BehaviorSubject<boolean>(true);
  private passwordSubject = new BehaviorSubject<string>("");

  // Expose Observables
  length$ = this.lengthSubject.asObservable();
  special$ = this.specialSubject.asObservable();
  numbers$ = this.numbersSubject.asObservable();
  uppercase$ = this.uppercaseSubject.asObservable();
  lowercase$ = this.lowercaseSubject.asObservable();
  password$ = this.passwordSubject.asObservable();

  // Expose methods to update values
  setLength(value: number): void {
    this.lengthSubject.next(value);
  }

  setSpecial(value: boolean): void {
    this.specialSubject.next(value);
  }

  setNumbers(value: boolean): void {
    this.numbersSubject.next(value);
  }

  setUppercase(value: boolean): void {
    this.uppercaseSubject.next(value);
  }

  setLowercase(value: boolean): void {
    this.lowercaseSubject.next(value);
  }

  setSharedPassword(value: string): void {
    this.passwordSubject.next(value);
  }

  // Expose methods to get values
  getSharedLength(): number {
    return this.lengthSubject.getValue();
  }

  getSharedSpecial(): boolean {
    return this.specialSubject.getValue();
  }

  getSharedNumbers(): boolean {
    return this.numbersSubject.getValue();
  }

  getSharedUppercase(): boolean {
    return this.uppercaseSubject.getValue();
  }

  getSharedLowercase(): boolean {
    return this.lowercaseSubject.getValue();
  }

  getSharedPassword(): string {
    return this.passwordSubject.getValue();
  }

}
