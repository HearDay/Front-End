import { NewsTest } from '@/components/screens/NewsPlayer/NewsTest';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView>
<NewsTest newsId="test-id-123" />
    </SafeAreaView>
  );
}