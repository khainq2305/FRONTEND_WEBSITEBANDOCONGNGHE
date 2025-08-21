import { UserProvider } from '@/contexts/UserContext';
import AllCommentList from '../Comment/AllCommentList';

export default function AdminReviewsPage() {
  return (
    <UserProvider>
      <AllCommentList />
    </UserProvider>
  );
}
