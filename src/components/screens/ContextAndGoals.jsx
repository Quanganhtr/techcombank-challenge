'use client'

import { motion } from 'framer-motion'

const CONTEXT_PARAGRAPHS = [
  'Thực trạng hiện tại của phần lớn các ứng dụng ngân hàng truyền thống thường được cấu trúc tĩnh—người dùng phải tự điều hướng qua nhiều tầng menu phức tạp để tìm tính năng mình cần.',
  `Khi người dùng ngày càng quen thuộc với các không gian kỹ thuật số có tính cá nhân hóa cao, việc bắt họ phải "đi tìm" tính năng sẽ tạo ra ma sát (friction). Đứng từ góc độ kiến trúc hệ thống, việc chuyển dịch sang AI-first không chỉ là đính kèm một con chatbot vào ứng dụng. Đây là cơ hội để tái cấu trúc toàn bộ nền tảng: chuyển từ một màn hình "lưới icon" (grid of icons) cứng nhắc sang một không gian tài chính linh hoạt, hoạt động dựa trên ý định của người dùng (intent-driven) và có khả năng dự đoán nhu cầu trước cả khi họ chạm vào màn hình.`,
]

const GOALS = [
  {
    id: 'a',
    title: 'A. Trải nghiệm người dùng & Kiến trúc hệ thống',
    items: [
      `Từ "Điều hướng" sang "Ý định" (Navigation to Intent): Giảm tải nhận thức (cognitive load) bằng cách cho phép tương tác qua ngôn ngữ tự nhiên. Khi đó, AI đóng vai trò như một engine điều phối, tự động gọi ra các luồng tác vụ thay vì bắt người dùng lục lọi menu.`,
      'Hệ thống Module dự đoán (Predictive Modularity): Xây dựng màn hình Home như một nền tảng linh hoạt. Các widget sẽ tự động sắp xếp lại dựa trên ngữ cảnh thực tế (ví dụ: module thanh toán nổi lên vào ngày đến hạn hóa đơn, hoặc phân bổ tiền tiết kiệm xuất hiện vào ngày nhận lương).',
      'Dữ liệu mang tính hành động (Actionable Transparency): Đối với mảng Wealth, cần sử dụng các Data Column rành mạch kết hợp với insight dự báo để thay thế cho những bảng biểu thống kê khô khan, giúp người dùng tự tin đưa ra quyết định ngay lập tức.',
    ],
  },
  {
    id: 'b',
    title: 'B. Mục tiêu Kinh doanh',
    items: [
      `Hệ thống UI sinh tạo (Generative UI Framework): Xây dựng một thư viện component có quy chuẩn chặt chẽ, sẵn sàng được AI "lắp ghép" và render ra các giao diện chức năng ngay lập tức trên màn hình Search.`,
      'Ngôn ngữ thị giác cao cấp (Premium Aesthetic): Cân bằng giữa sự đổi mới của AI và sự tin cậy của ngành ngân hàng bằng phong cách thiết kế tinh tế. Ứng dụng các chất liệu thị giác có chiều sâu và độ trong suốt tinh giản (như kính mờ - frosted glass) để trải nghiệm dữ liệu tài chính mang lại cảm giác sang trọng, an tâm.',
    ],
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export function ContextAndGoals() {
  return (
    <section className="bg-black flex flex-col items-center px-8 py-16 md:px-16 md:py-32">
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
        className="border-b border-dashed border-zinc-800 flex flex-col items-start gap-6 max-w-(--spacing-max-width) w-full py-6 md:py-12"
      >
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
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="border-b border-dashed border-zinc-800 flex flex-col items-start gap-6 max-w-(--spacing-max-width) w-full py-6 md:py-12"
      >
        <span className="material-symbols-outlined text-content-inverse text-[32px]" aria-hidden="true">
          strategy
        </span>
        <h3 className="t-h1 text-content-inverse">Goals</h3>

        {GOALS.map((goal) => (
          <div key={goal.id} className="flex flex-col items-start gap-4 w-full">
            <h4 className="t-h3 text-content-inverse">{goal.title}</h4>
            <ul className="list-disc t-body-lg text-neutral-500 w-full pl-6">
              {goal.items.map((item, i) => (
                <li key={i} className="leading-normal">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
