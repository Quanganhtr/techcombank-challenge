'use client'

import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const SEGMENTS = [
  [
    {
      icon: 'boy',
      title: 'Học sinh / Sinh viên',
      items: [
        { bold: 'Chân dung:', text: ' Thu nhập thấp, phụ thuộc gia đình; số dư nhỏ.' },
        { bold: 'Vấn đề:', text: ' Tần suất chi tiêu cao, dễ mất kiểm soát với các khoản lặt vặt.' },
        { bold: 'Giải pháp:', text: ' Phân tích giao dịch để cảnh báo trực quan (VD: "Bạn đã chi 40% ngân sách cho trà sữa") và đề xuất cách quản lý chi tiêu.' },
      ],
    },
    {
      icon: 'work',
      title: 'Người mới đi làm',
      items: [
        { bold: 'Chân dung:', text: ' Thu nhập tầm trung, bắt đầu có tư duy tích lũy và có khoản dư nhỏ mỗi tháng.' },
        { bold: 'Vấn đề:', text: ' Muốn đầu tư nhưng không biết bắt đầu từ đâu.' },
        { bold: 'Giải pháp:', text: ': Chủ động gọi tên khoản tiền nhàn rỗi và đề xuất các kênh đầu tư/tích lũy có rủi ro thấp.' },
      ],
    },
  ],
  [
    {
      icon: 'work_history',
      title: 'Người đi làm lâu năm',
      items: [
        { bold: 'Chân dung:', text: ' Thu nhập cao, ổn định. Sở hữu tài sản lớn. Nhưng đầu tư sinh lợi nhuận thật là không nhiều.' },
        { bold: 'Vấn đề:', text: ' Có hiểu biết về đầu tư nhưng chưa đủ chuyên sâu để tối ưu hóa dòng tiền liên tục.' },
        { bold: 'Giải pháp:', text: ': Bóc tách chi phí cơ hội của khoản tiền để không và đưa ra các đề xuất tối ưu tài sản nhanh chóng.' },
      ],
    },
    {
      icon: 'elderly',
      title: 'Người ngoài độ tuổi lao động',
      items: [
        { bold: 'Chân dung:', text: ' Thu nhập cố định (lương hưu, nguồn thụ động); khẩu vị rủi ro thấp, ưu tiên sự an toàn.' },
        { bold: 'Vấn đề:', text: ' Mục tiêu là bảo toàn vốn và nhận lãi đều đặn; rất ngại và bối rối trước các thao tác app phức tạp.' },
        { bold: 'Giải pháp:', text: ': Đơn giản hóa trạng thái tài sản để mang lại sự an tâm.' },
      ],
    },
  ],
]

function SegmentCard({ icon, title, items, hasBorder }) {
  return (
    <div
      className={`flex flex-[1_0_0] flex-col gap-6 items-start min-w-0 ${
        hasBorder
          ? 'border-b border-dashed border-zinc-800 pb-12 pt-0'
          : 'pt-12 pb-0'
      }`}
    >
      <span className="material-symbols-outlined text-content-inverse text-[32px]" aria-hidden="true">
        {icon}
      </span>
      <h3 className="t-h1 text-content-inverse">{title}</h3>
      <ul className="list-disc t-body-lg text-neutral-500 w-full pl-6 space-y-1">
        {items.map((item, i) => (
          <li key={i}>
            {item.bold && <span className="text-content-inverse font-semibold">{item.bold}</span>}
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function UserSegments() {
  return (
    <section className="bg-black px-8 py-16 md:px-16 md:py-32 min-h-dvh flex flex-col justify-center">
      <div className="flex flex-col md:flex-row gap-16 md:gap-24 max-w-(--spacing-max-width) mx-auto items-start">

        {/* LEFT: Sticky sidebar header — pins 128px from top on desktop */}
        <div className="md:sticky md:top-32 shrink-0 w-full md:max-w-[320px] md:pb-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col gap-4"
          >
            <div className="bg-surface-raised flex flex-col items-center justify-center p-2 rounded-xl w-fit">
              <span className="t-h3 text-content-primary w-8 text-center">2</span>
            </div>
            <h2 className="t-display text-content-inverse">Define users</h2>
          </motion.div>
        </div>

        {/* RIGHT: Scrollable content rows */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Row 1 — dashed border-b */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row gap-10"
          >
            {SEGMENTS[0].map((segment, i) => (
              <SegmentCard key={i} {...segment} hasBorder={true} />
            ))}
          </motion.div>

          {/* Row 2 — no border, pt-12 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row gap-10"
          >
            {SEGMENTS[1].map((segment, i) => (
              <SegmentCard key={i} {...segment} hasBorder={false} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
