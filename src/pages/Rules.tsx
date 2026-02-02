import { Layout } from "@/components/layout/Layout";

const rules = [
  "No cheating, botting, or use of unauthorized third-party tools.",
  "No harassment, hate speech, or abusive behavior.",
  "Do not exploit bugs. Report them to staff.",
  "Respect GM decisions and follow community guidelines.",
];

export default function Rules() {
  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Server Rules</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Keep the game fair and enjoyable for everyone.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {rules.map((rule) => (
              <li key={rule} className="gaming-card rounded-xl p-4">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
