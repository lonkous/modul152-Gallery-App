import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../../firebase/firebase";
import Cards from "./Cards";
const MainBody = () => {
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    const imageListRef = ref(storage, "images/");
    const getImageList = async () => {
      const res = await listAll(imageListRef);
      const urls = await Promise.all(
        res.items.map(
          async (itemRef): Promise<{ url: string; createdAt: Date }> => {
            const url = await getDownloadURL(itemRef);
            const metadata = await getMetadata(itemRef);
            const createdAt = new Date(metadata.timeCreated);
            return { url, createdAt };
          }
        )
      );
      urls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setImageList(urls.map((item) => item.url));
    };

    void getImageList();
  }, [imageList]);

  return (
    <>
      <main className="-z-100">
        <div>
          <div className="flex flex-wrap gap-10 ">
            {imageList.map((url, index) => (
              <div key={index}>
                <Cards url={url} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer>
        <div>
          <h1></h1>
        </div>
      </footer>
    </>
  );
};
export default MainBody;
