import { Component } from '@angular/core';
import { MortgageApplication } from '../../models/property.model';

@Component({
  selector: 'app-mortgage',
  standalone: false,
  templateUrl: './mortgage.component.html',
  styleUrls: ['./mortgage.component.css']
})
export class MortgageComponent {
  mortgageData = {
    propertyPrice: 0,
    downPayment: 0,
    interestRate: 4.5,
    loanTerm: 30
  };
  
  calculatedResults = {
    loanAmount: 0,
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0
  };

  loading = false;
  applicationSubmitted = false;

  calculateMortgage(): void {
    const principal = this.mortgageData.propertyPrice - this.mortgageData.downPayment;
    const monthlyRate = this.mortgageData.interestRate / 100 / 12;
    const numberOfPayments = this.mortgageData.loanTerm * 12;

    if (principal > 0 && monthlyRate > 0) {
      const monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      this.calculatedResults = {
        loanAmount: principal,
        monthlyPayment: monthlyPayment,
        totalPayment: monthlyPayment * numberOfPayments,
        totalInterest: (monthlyPayment * numberOfPayments) - principal
      };
    }
  }

  applyForMortgage(): void {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
      this.applicationSubmitted = true;
      alert('Mortgage application submitted successfully! A loan officer will contact you within 48 hours.');
    }, 1500);
  }

  resetCalculator(): void {
    this.mortgageData = {
      propertyPrice: 0,
      downPayment: 0,
      interestRate: 4.5,
      loanTerm: 30
    };
    this.calculatedResults = {
      loanAmount: 0,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0
    };
  }

  get downPaymentPercentage(): number {
    if (this.mortgageData.propertyPrice > 0) {
      return (this.mortgageData.downPayment / this.mortgageData.propertyPrice) * 100;
    }
    return 0;
  }
}
