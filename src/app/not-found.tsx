import { PageHero } from "@/components/sections";
import { PillLink } from "@/components/ui";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="404 · Page not found"
      title={<>Scratch. That page isn&apos;t here.</>}
      lead="The page may have moved. Head back to the homepage or check the table rates."
      image="/img/gallery/racking.jpg"
    >
      <PillLink href="/" tone="flame" icon="right">
        Back to the homepage
      </PillLink>
      <PillLink href="/table-rates" tone="ghost" icon="right">
        See table rates
      </PillLink>
    </PageHero>
  );
}
