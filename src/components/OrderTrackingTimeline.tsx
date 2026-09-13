import { Check } from 'lucide-react';
import { ORDER_TRACKING_STEPS, orderStepIndex } from '../config/orderStatus';

type Props = {
  status: string;
};

export default function OrderTrackingTimeline({ status }: Props) {
  const activeIndex = orderStepIndex(status);
  const allComplete = activeIndex >= ORDER_TRACKING_STEPS.length - 1;

  return (
    <div className="order-tracking" aria-label={`Order status: ${status}`}>
      <ol className="order-tracking-steps">
        {ORDER_TRACKING_STEPS.map((label, index) => {
          const done = allComplete ? index <= activeIndex : index < activeIndex;
          const current = !allComplete && index === activeIndex;
          return (
            <li
              key={label}
              className={`order-tracking-step ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`}
            >
              <span className="order-tracking-marker" aria-hidden>
                {done ? <Check size={14} strokeWidth={2.5} /> : index + 1}
              </span>
              <span className="order-tracking-label">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
