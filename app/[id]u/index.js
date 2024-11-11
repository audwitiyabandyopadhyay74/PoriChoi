    "use client";
    // pages/posts/index.js
    import Link from 'next/link';
    import { useEffect, useState } from 'react';
    import { firestore } from '../../firebase';
    import { usePathname } from 'next/navigation';
    async function fetchDatafromFirebase() {
        const querySnapshot = await getDocs(collection(firestore, 'posts'));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    const PostsI = () => {
        const pathname = usePathname()
        const [posts, setPosts] = useState([]);
        useEffect(() => {
            async function fetchData() {
                try {
                    const data = await fetchDatafromFirebase();
                    setPosts(data);
                    // setPoststitle(data[0] ? .title || '');
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            async function fetchData() {
                try {
                    const data = await fetchDatafromFirebase();
                    setPosts(data);
                    setPoststitle(data[0] ? .title || '');
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }

            fetchData();
        }, []);
        return ( <
            div >
            <
            h1 > Posts < /h1> <
            ul > {
                posts.map(post => ( <
                    li key = { post.id } >
                    <
                    Link href = { `/posts/${post.id}` } >
                    <
                    a > { post.title } < /a> < /
                    Link > <
                    /li>
                ))
            } <
            /ul> < /
            div >
        );
    };

    export default PostsI;