import { Suspense } from 'react';
import Explore from '../../components/Explore';

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <Explore />
    </Suspense>
  );
}
