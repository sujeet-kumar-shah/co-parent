import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        <section className="container py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">Terms &amp; Conditions</h1>

            <p className="text-muted-foreground mb-6">
              Welcome to CO-PARENTS. These Terms &amp; Conditions govern your use of our website and services. By accessing or using our platform you agree to be bound by these terms.
            </p>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">1. Using the Service</h2>
              <p className="text-muted-foreground">
                You may use our platform to discover and list student services such as hostels, PGs, coaching centers, libraries and more. You agree to use the platform responsibly and not engage in any activity that is illegal or harmful.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">2. Accounts &amp; Security</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">3. Listings &amp; Content</h2>
              <p className="text-muted-foreground">
                Vendors must provide accurate and lawful information for listings. We do not guarantee the accuracy of third-party listings and advise users to verify details before making any commitments.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">4. Payments &amp; Transactions</h2>
              <p className="text-muted-foreground">
                Any payment arrangements between users and vendors are at their discretion. CO-PARENTS is not a party to transactions and is not responsible for payment disputes.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, CO-PARENTS will not be liable for indirect, incidental or consequential damages arising from your use of the platform.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">6. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms are governed by the laws of India. Any dispute shall be resolved in the appropriate courts located in India.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. We will notify users of material changes and update the effective date accordingly.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, contact us at <a href="mailto:support@coparents.in" className="text-primary underline">support@coparents.in</a>.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
