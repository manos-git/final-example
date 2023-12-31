import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data-cm';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const {
    totalModels2020,
    totalModels2021,
    totalModels2022,
    totalModels2023,
  } = await fetchCardData();

  return (
    <>
      <Card title="Μοντέλα (τιμολογημένα) 2020" value={totalModels2020} type="collected" />
      <Card title="Μοντέλα (τιμολογημένα) 2021" value={totalModels2021} type="pending" />
      <Card title="Μοντέλα (τιμολογημένα) 2022" value={totalModels2022} type="invoices" />
      <Card
        title="Μοντέλα (τιμολογημένα) 2023"
        value={totalModels2023}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
