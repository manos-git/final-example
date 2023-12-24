import { fetchFilteredCustomers } from '@/app/lib/data-cm';
import { CustomersTableType, FormattedCustomersTable } from '@/app/lib/definitions-cm';
import CustomersTable from '@/app/ui/customers/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || 'ΑΒ';

  const customers  = await fetchFilteredCustomers(query);

  return (
    <main>
      
      {customers && 
       <CustomersTable customers={customers} />
      }
        
    </main>
  );
}
