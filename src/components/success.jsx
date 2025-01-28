
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Success = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Use optional chaining to safely access query parameters
  const { status, session_id, temp_id } = router.query || {};

  useEffect(() => {
    if (status && session_id && temp_id) {
      const fetchData = async () => {
        try {
          // Trigger the income certificate submission after successful payment
          const res = await fetch('/api/submit-income-certificate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId: session_id,
              tempDataId: temp_id,
              paymentStatus: status,
            }),
          });

          const data = await res.json();
          if (data.success) {
            console.log('Income certificate submission successful');
            router.push('/income-form'); // Redirect to income form or confirmation page
          } else {
            console.error('Income certificate submission failed');
          }
        } catch (error) {
          console.error('Error during income certificate submission:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [status, session_id, temp_id, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Payment Success</h1>
      <p>Your payment has been successfully processed.</p>
    </div>
  );
};

export default Success;
