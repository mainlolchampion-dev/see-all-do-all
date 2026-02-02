import { Layout } from "@/components/layout/Layout";

const faqs = [
  {
    question: "How do I create an account?",
    answer: "Go to Create Account, fill in your game username, email, and password.",
  },
  {
    question: "Do I need the full client?",
    answer: "Yes. Download the full client first, then apply the system patch if required.",
  },
  {
    question: "How do donations work?",
    answer: "Donations are processed through Stripe. Coins are delivered automatically.",
  },
];

export default function FAQ() {
  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl font-bold mb-4">
            <span className="text-gradient-gold">FAQ</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Answers to common questions about the server.
          </p>
          <div className="space-y-6">
            {faqs.map((item) => (
              <div key={item.question} className="gaming-card rounded-xl p-6">
                <h3 className="font-semibold mb-2">{item.question}</h3>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
