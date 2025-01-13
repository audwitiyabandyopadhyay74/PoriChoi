"use client";

import { useEffect, useState } from "react";
import { firestore, auth } from "../../firebase";
import { collection, getDocs, query, where, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { usePathname } from "next/navigation";
import NavBar from "../../Components/NavBar";
import Image from "next/image";
import Post from "../../Components/Post";
import { onAuthStateChanged } from "firebase/auth";
import MobileNav from "../../Components/Mobile Nav";
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user.uid : null);
    });
  }, []);

  const fetchUserData = async (userId) => {
    const userDocRef = doc(firestore, "userFollowingdata", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data(),
      };
    }
    return null;
  };

  const fetchUserPosts = async (userName) => {
    const postsRef = collection(firestore, "posts");
    const q = query(postsRef, where("username", "==", userName));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userId = pathname.replace("/user/", "");
      const userData = await fetchUserData(userId);

      if (userData) {
        setUser(userData);
        setFollowersCount(userData.followers?.length || 0);
        setFollowingsCount(userData.followings?.length || 0);

        const userPosts = await fetchUserPosts(userData.userName);
        setPosts(userPosts);
      } else {
        setUser(null);
      }
    } catch (error) {
      setError("Error fetching user data");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [pathname]);

  const handleFollow = async (userId) => {
    if (!currentUser) {
      toast.error("Please be logged in to follow users!");
      return;
    }

    try {
      const userDocRef = doc(firestore, "userFollowingdata", userId);
      const currentUserDocRef = doc(firestore, "userFollowingdata", currentUser);
      const userDoc = await getDoc(userDocRef);

      const userFollowers = userDoc.data()?.followers || [];
      const currentFollowings = (await getDoc(currentUserDocRef)).data()?.followings || [];

      console.log(currentFollowings);

      if (!userFollowers.includes(currentUser)) {
        // Follow user
        await updateDoc(userDocRef, {
          followers: arrayUnion(currentUser),
        });
        await updateDoc(currentUserDocRef, {
          followings: arrayUnion(userId),
        });

        setFollowersCount((prevCount) => prevCount + 1);
        setFollowingsCount((prevCount) => prevCount + 1);
        setUser((prevUser) => ({
          ...prevUser,
          followers: [...prevUser.followers, currentUser],
        }));
      } else {
        // Unfollow user
        await updateDoc(userDocRef, {
          followers: arrayRemove(currentUser),
        });
        await updateDoc(currentUserDocRef, {
          followings: arrayRemove(userId),
        });

        setFollowersCount((prevCount) => prevCount - 1);
        setFollowingsCount((prevCount) => prevCount - 1);
        setUser((prevUser) => ({
          ...prevUser,
          followers: prevUser.followers.filter((follower) => follower !== currentUser),
        }));
      }
      loadUserData(); // Re-render follower and following count
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  if (loading) return <div className="w-screen h-screen flex items-center justify-center font-bold">Loading...</div>;
  if (error) return <div>{error}</div>;

  return (  
    <>
      <MobileNav />
      <NavBar />

      <div className="w-screen flex flex-col items-center justify-center">
        <ToastContainer
          toastClassName="relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer shadow-xl"
          bodyClassName="text-sm font-medium text-white block p-3"
          position="bottom-left"
          autoClose={3000}
        />
        <div className="bg-white w-full lg:w-1/2 p-1">
          <div className="flex w-full h-[20vh] items-center justify-between p-4">
            <div className="flex flex-col w-full h-full">
              <div className="flex items-center mt-10">
                <Image
                  src={user?.pic || "https://via.placeholder.com/150"}
                  alt="User"
                  width={100}
                  height={100}
                  className="rounded-full w-24 h-24"
                />
                <span className="ml-4 text-xl font-semibold">
                  {user ? user.userName : "User Not Found"}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">Followers</h2>
              <div>{followersCount}</div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">Followings</h2>
              <div>{followingsCount}</div>
            </div>
          </div> <br />
          <div className="flex items-center justify-center w-full h-[4vh]">
          <button
            onClick={() => handleFollow(user.id)} 
            className={`  text-white rounded  h-[4vh] w-[50%] ${
              Array.isArray(user.followers) && user.followers.includes(currentUser) ? "bg-gray-400" : "bg-blue-500 pulse"
            }`}
          >
            {Array.isArray(user.followers) && user.followers.includes(currentUser) ? "Unfollow" : "Follow"}
          </button>
          </div>
          

          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Posts</h2>
            {posts.length > 0 ? (
              posts.map((post) => <Post key={post.id} {...post} />)
            ) : (
              <div>No posts were uploaded by the user!</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
