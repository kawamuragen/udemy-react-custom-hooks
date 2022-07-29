import axios from "axios";
import { useState } from "react";
import { UserProfile } from "../types/userProfile";
import { User } from "../types/api/user";

// 全ユーザー一覧を所得するカスタムフック
// App.tsx に書いていた以下の処理をファイル分けることで
// App.tsx のソースがスッキリする。
export const useAllUsers = () => {
  const [userProfiles, setUserProfiles] = useState<Array<UserProfile>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getUsers = () => {
    // ボタン押されたとき：　ロード状態true  エラー状態false
    setLoading(true);
    setError(false);

    // finallyを使えるのはes2018移行。tsconfig.jsonをいじる。
    axios
      .get<Array<User>>("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        // 取得したUser型データを使ってUserProfile型配列を作る。
        const data = res.data.map((user) => ({
          id: user.id,
          name: `${user.name}(${user.username})`,
          email: user.email,
          address: `${user.address.city}${user.address.suite}${user.address.street}`
        }));
        setUserProfiles(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 他のコンポーネントで利用できるようにreturnする
  return { getUsers, userProfiles, loading, error };
};
