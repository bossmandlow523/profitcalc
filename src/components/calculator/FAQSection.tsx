import { Button } from '../ui/button'
import { HelpCircle } from 'lucide-react'

interface FAQSectionProps {
  strategyName: string
  questions: string[]
}

export function FAQSection({ strategyName, questions }: FAQSectionProps) {
  return (
    <div className="glass-card-strong rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-w-[90rem] mx-auto mb-8 md:mb-12">
      <div className="px-4 md:px-16 py-6 md:py-10 bg-gradient-to-r from-[#3a9447]/20 to-[#07eb29]/20 border-b border-white/10">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <HelpCircle className="w-6 md:w-8 h-6 md:h-8 text-[#07eb29]" />
          <h2 className="text-xl md:text-4xl font-bold text-white text-center">
            Commonly asked {strategyName} questions
          </h2>
        </div>
      </div>
      <div className="p-4 md:p-16 space-y-3 md:space-y-4">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-left px-4 md:px-6 py-4 md:py-5 rounded-xl border-2 border-white/10 text-gray-300 hover:bg-gradient-to-r hover:from-[#3a9447]/10 hover:to-[#07eb29]/10 hover:border-[#07eb29]/50 hover:text-white transition-all duration-200 text-sm md:text-lg font-medium"
          >
            <span className="text-[#07eb29] mr-2 md:mr-3 text-base md:text-xl">Q{index + 1}:</span>
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
