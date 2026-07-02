'use client'

import { motion } from 'framer-motion'

const CONTEXT_PARAGRAPHS = [
  'Techcombank đang cung cấp đầy đủ các dịch vụ tài chính, từ thanh toán, tiết kiệm đến đầu tư. Thách thức tiếp theo bên cạnh việc bổ sung thêm tính năng, đó là giúp người dùng khai thác hiệu quả hơn những dữ liệu đã có. Đề xuất này tích hợp AI như một lớp Intelligence Layer xuyên suốt các tính năng trên app, giúp dữ liệu trở nên dễ hiểu, có ngữ cảnh và hỗ trợ ra quyết định tốt hơn.',
]

const GOALS = [
  {
    id: 'a',
    title: null,
    items: [
      'Giúp người dùng hiểu rõ hơn về tình hình tài chính của mình.',
      'Giảm rào cản khi khám phá và sử dụng các dịch vụ.',
      'Hỗ trợ người dùng đưa ra quyết định đầu tư tự tin hơn.',
      'Tích hợp AI một cách tự nhiên xuyên suốt trải nghiệm.',
    ],
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export function ContextAndGoals() {
  return (
    <section className="bg-black flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-32 min-h-dvh">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="border-b border-dashed border-zinc-800 flex flex-col items-start gap-4 max-w-(--spacing-max-width) w-full pb-6 md:pb-12"
      >
        <div className="bg-surface-raised flex flex-col items-center justify-center p-2 rounded-xl">
          <span className="t-h3 text-content-primary w-8 text-center">1</span>
        </div>
        <h2 className="t-display text-content-inverse">Context &amp; Goals</h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="border-b border-dashed border-zinc-800 flex flex-col md:flex-row items-start gap-6 md:gap-16 max-w-(--spacing-max-width) w-full py-6 md:py-12"
      >
        {/* Context */}
        <div className="flex flex-col items-start gap-6 flex-1 min-w-0">
          <span className="material-symbols-outlined text-content-inverse text-[32px]" aria-hidden="true">
            topic
          </span>
          <h3 className="t-h1 text-content-inverse">Context</h3>
          <div className="flex flex-col gap-0 w-full">
            {CONTEXT_PARAGRAPHS.map((paragraph, i) => (
              <p key={i} className="t-body-lg text-neutral-500 mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="flex flex-col items-start gap-6 flex-1 min-w-0">
          <span className="material-symbols-outlined text-content-inverse text-[32px]" aria-hidden="true">
            strategy
          </span>
          <h3 className="t-h1 text-content-inverse">Goals</h3>
          {GOALS.map((goal) => (
            <div key={goal.id} className="flex flex-col items-start gap-4 w-full">
              {goal.title && <h4 className="t-h3 text-content-inverse">{goal.title}</h4>}
              <ul className="list-disc t-body-lg text-neutral-500 w-full pl-6">
                {goal.items.map((item, i) => (
                  <li key={i} className="leading-normal">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
