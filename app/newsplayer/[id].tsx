import { useLocalSearchParams } from 'expo-router';
import { NewsPlayerScreen } from '../../components/screens/NewsPlayer/NewsPlayerScreen';

export default function NewsPlayerPage() {
  const { id, from, playlist } = useLocalSearchParams<{
    id: string;
    from?: string;
    playlist?: string;
  }>()

  if (!id) {
    return null
  }

  const isPlaylistMode = playlist === 'true';

  return <NewsPlayerScreen articleId={id} from={from} isPlaylistMode={isPlaylistMode} />
}
