import { Button } from '../ui/button'

interface FAQSectionProps {
  strategyName: string
  questions: string[]
}

export function FAQSection({ strategyName, questions }: FAQSectionProps) {
  return (
    <div className="glass-card-strong rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="text-lg font-bold text-white">Commonly asked {strategyName} questions</h2>
      </div>
      <div className="p-6 space-y-3">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-left px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:border-primary hover:text-white transition-all duration-200"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
