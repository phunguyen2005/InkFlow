import { LibraryShell } from "@/features/library/components/navigation/site-header";
import { library } from "@/features/library/data/library";
import { MyLibrary } from "@/features/account/my-library";

export default async function MyLibraryPage() {
  const stories = await library.listStories({ pageSize: 24 });
  return (
    <LibraryShell>
      <main id="main" className="page-width">
        <MyLibrary stories={stories.items} />
      </main>
    </LibraryShell>
  );
}
