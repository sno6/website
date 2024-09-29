import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import FadeIn from "react-fade-in";

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <FadeIn>
      <div className={styles.container}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Projects and Ramblings" />
          <meta name="og:title" content="Projects and Ramblings" />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <header className={styles.header}>
          {home ? (
            <>
              <Image
                priority
                src="/images/face.png"
                height={144}
                width={144}
                alt={"face"}
              />
            </>
          ) : (
            <>
              <Link href="/">
                <a>
                  <Image
                    priority
                    src="/images/face.png"
                    height={108}
                    width={108}
                    alt={"face"}
                  />
                </a>
              </Link>
            </>
          )}
          <div className={utilStyles.myLinks}>
            <a href="https://www.github.com/sno6">Github</a>
            <img src="/images/ellipse.svg" width={4} height={4} />
            <a href="https://www.linkedin.com/in/farley-schaefer-845731154">
              LinkedIn
            </a>
            <img src="/images/ellipse.svg" width={4} height={4} />
            <a href="/misc/cv.pdf">Résumé</a>
          </div>
        </header>
        <main className={!home ? utilStyles.postContent : undefined}>
          {children}
        </main>
        {!home && (
          <div className={styles.backToHome}>
            <Link href="/">
              <a>
                <img
                  src="/images/arrow-reverse.svg"
                  height={8}
                  width={22}
                  className={utilStyles.arrowReverse}
                />
                <span>Back to home</span>
              </a>
            </Link>
          </div>
        )}
      </div>
    </FadeIn>
  );
}
