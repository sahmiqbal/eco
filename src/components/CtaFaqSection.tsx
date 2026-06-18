import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const faqItems = [
  {
    value: 'faq-item-1',
    question: 'What makes LAHLINO rituals different?',
    answer: 'Each ritual is crafted with premium natural ingredients, inspired by Moroccan beauty traditions and designed for modern self-care.',
  },
  {
    value: 'faq-item-2',
    question: 'How long does delivery take?',
    answer: 'Orders typically arrive within 3-5 business days, with tracking updates sent immediately after shipment.',
  },
  {
    value: 'faq-item-3',
    question: 'Can I use these products on sensitive skin?',
    answer: 'Yes. Our formulas are gentle, dermatologist-tested, and designed to nourish sensitive skin without irritation.',
  },
]

export function CtaFaqSection() {
  return (
    <section className="bg-card mt-4 text-foreground">
      <div className="container mx-auto max-w-4xl px-1">
        <div className="faq-3d-card mx-auto max-w-4xl">
          <div className="faq-3d-scene">
            <div className="faq-3d-panel rounded-[2.5rem] border border-border bg-background shadow-[0_60px_140px_-70px_rgba(0,0,0,0.18)] transition-transform duration-1000 hover:-translate-y-1 hover:shadow-[0_70px_170px_-70px_rgba(0,0,0,0.24)]">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8">
                <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 pointer-events-none" />
                <div className="relative z-10">
                  <div className="mb-10 text-center">
                    <p className="inline-flex items-center justify-center gap-2 text-sm uppercase tracking-[0.32em] text-primary/80">
                      <Sparkles className="size-4" /> Customer support
                    </p>
                    <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-foreground">Frequently Asked Questions</h2>
                    
                  </div>

                  <Accordion type="single" collapsible defaultValue="faq-item-1" className="space-y-4">
                    {faqItems.map((item) => (
                      <AccordionItem
                        key={item.value}
                        value={item.value}
                        className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition hover:border-primary/40"
                      >
                        <AccordionTrigger className="px-6 py-5 text-left text-base font-semibold text-foreground">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-5 text-muted-foreground">
                          <p>{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button
                      size="lg"
                      className="rounded-full bg-primary px-8 py-4 text-primary-foreground shadow-[0_10px_30px_-15px_rgba(213,82,163,0.35)] transition hover:bg-primary/90"
                      asChild
                    >
                      <Link to="/shop" className="flex items-center justify-center gap-2">
                        Shop Our Rituals
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full border-border bg-background px-8 py-4 text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                      asChild
                    >
                      <Link to="/shop?category=individual" className="flex items-center justify-center gap-2">
                        Browse Products
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
