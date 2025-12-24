"use client";

import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="bg-gray-50 font-sans min-h-screen py-8 sm:py-12">
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 bg-white rounded-2xl shadow-lg">
        <header className="border-b pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center">Refund & Cancellation Policy</h1>
          <p className="text-center text-sm text-gray-500 mt-2">Last Updated: October 14, 2025</p>
        </header>

        <main className="space-y-8 text-gray-700">
          <p>
            This Refund & Cancellation Policy (“Policy”) applies to all services booked with Sparky. By booking our services, Customers agree to the following terms. This Policy must be read together with the Terms & Conditions (“T&C”), and words defined in the T&C shall carry the same meaning here.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Booking & Payment</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>(a) All bookings must be confirmed through the Company’s authorized platform, phone line, or representatives.</p>
              <p>(b) Payments may be made via online payment gateways, UPI, debit/credit cards.</p>
              <p>(c) The full service fee (or any required advance) must be paid as per the booking confirmation.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Cancellation & Refund Rules</h2>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-700">2.1 Pre-Scheduled Services (e.g., beauticians, technicians, decorators)</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Cancellation more than 24 hours before:</strong> Full refund of prepaid amounts.</li>
                  <li><strong>Cancellation 12-24 hours before:</strong> 50% refund of prepaid amounts.</li>
                  <li><strong>Cancellation less than 12 hours before or no-show:</strong> No refund.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">2.2 Same-Day / Instant Services (e.g., cleaning, urgent repairs)</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>If the Customer cancels before the Technician leaves their location (approx. within 15 mins of booking), a full refund is provided.</li>
                  <li>If the Technician has already departed for the Customer’s premises, the booking is non-refundable.</li>
                </ul>
              </div>
               <div>
                <h3 className="font-semibold text-gray-700">2.3 Company-Initiated Cancellations</h3>
                <p>If the Company or assigned Technician cancels a booking, the Customer will receive a full refund or may reschedule at no additional cost.</p>
              </div>
               <div>
                <h3 className="font-semibold text-gray-700">2.4 Refund Timeline</h3>
                <p>Approved refunds will be processed within 7 business days to the original payment method, plus any additional time required by the bank.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Late Arrival Policy</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>(a) If the Technician is delayed by more than 30 minutes without prior notice and a valid reason, the Customer may cancel for a full refund or request a replacement.</p>
              <p>(b) If the Customer is unavailable at the service location within 15 minutes of the scheduled time, the booking may be marked as a no-show with no refund.</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Quality Issues & Rework</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>(a) Dissatisfaction with a service must be reported within 48 hours of completion.</p>
              <p>(b) The Company will offer a rework at no charge if the complaint is deemed genuine.</p>
              <p>(c) If rework is not feasible, a partial refund may be provided, capped at the booking amount.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Chargeback Policy</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>(a) Customers must follow the refund process before initiating a chargeback.</p>
              <p>(b) Unwarranted chargebacks may lead to account suspension and recovery of costs.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Refund Process</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p><strong>Step 1: Request →</strong> Submit a refund request to our official helpline or phone number within the specified timeframes.</p>
              <p><strong>Step 2: Verification →</strong> The Company will review the request within 48 hours and may require evidence (e.g., photos).</p>
              <p><strong>Step 3: Decision →</strong> The Company will inform you if the refund is approved, if a rework is offered, or if the request is rejected.</p>
              <p><strong>Step 4: Confirmation →</strong> You will receive confirmation once the refund is initiated.</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Exceptions</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>Refunds will not apply to: services already completed, parts or consumables used, unsafe environments caused by the customer, or claims reported outside the time limits.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contact for Refunds</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>All refund or cancellation requests must be directed to our official support channels.</p>
              {/* <p>Email: [Your Support Email]</p>
              <p>Phone: [Your Phone Number]</p> */}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}