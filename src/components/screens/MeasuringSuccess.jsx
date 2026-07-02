'use client'

import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const ROWS = [
  {
    measure: 'Home – AI Insight CTR',
    success: 'Người dùng tương tác với AI nhiều',
    iterate: 'Kiểm tra insight có đủ liên quan không, thử thay đổi thời điểm hiển thị, copy hoặc loại insight được ưu tiên.',
  },
  {
    measure: 'Home – Banner CTR',
    success: 'Banner cá nhân hóa hiệu quả hơn banner cũ',
    iterate: 'Điều chỉnh ranking engine, thử nghiệm asset (title, visual, CTA) và tăng mức độ cá nhân hóa.',
  },
  {
    measure: 'Search – Search Success Rate',
    success: 'Người dùng tìm đúng tính năng nhanh hơn',
    iterate: 'Phân tích các tìm kiếm thất bại, bổ sung synonym, cải thiện intent recognition và AI suggestions.',
  },
  {
    measure: 'Search – AI Suggestion Acceptance',
    success: 'Người dùng tiếp tục sang TRÍ',
    iterate: 'Nếu thấp, giảm số lượng gợi ý, viết lại prompt hoặc hiển thị gợi ý theo ngữ cảnh hơn.',
  },
  {
    measure: 'Wealth – Portfolio Summary Usage',
    success: 'Người dùng quay lại xem AI Summary',
    iterate: 'Nếu thấp, xem lại vị trí CTA, rút ngắn nội dung hoặc chuyển sang dạng insight card thay vì popup.',
  },
  {
    measure: 'Wealth – Investment Conversion',
    success: 'Người dùng đầu tư sau khi xem AI',
    iterate: 'Nếu thấp, phân tích bước drop-off, bổ sung giải thích "Why this recommendation?" hoặc tăng tính minh bạch của AI.',
  },
]

export function MeasuringSuccess() {
  return (
    <section className="bg-surface-raised px-8 py-16 md:px-16 md:py-32">
      <div className="flex flex-col gap-16 md:gap-24 max-w-(--spacing-max-width) mx-auto w-full">

        {/* Heading */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="t-display text-content-primary text-center"
        >
          Measuring success
        </motion.h2>

        {/* Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col w-full"
        >
          {/* Header row */}
          <div className="border-b border-dashed border-zinc-200 pb-6 hidden md:grid items-start w-full" style={{ gridTemplateColumns: '1fr 1fr 1.75fr', gap: 24 }}>
            <p className="t-h3 text-content-primary">Measure</p>
            <p className="t-h3 text-content-primary">If successful</p>
            <p className="t-h3 text-content-primary">{`If not, I'd iterate by...`}</p>
          </div>

          {/* Data rows */}
          {ROWS.map((row, i) => (
            <div
              key={i}
              className={`flex flex-col md:grid items-start w-full py-6 ${i < ROWS.length - 1 ? 'border-b border-dashed border-zinc-200' : ''}`}
              style={{ gridTemplateColumns: '1fr 1fr 1.75fr', gap: 24 }}
            >
              <p className="t-body-lg text-content-primary">{row.measure}</p>
              <p className="t-body-lg text-black">{row.success}</p>
              <p className="t-body-lg text-black">{row.iterate}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
