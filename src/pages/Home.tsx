import { Helmet } from "react-helmet"
import HeroSection from '../components/HeroSection'
import DonorsList from './DonorsList'

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Blood Donor List Kaliganj | RoktoData</title>

        <meta
          name="description"
          content="Kaliganj এর জন্য Blood Donor List খুঁজুন। RoktoData তে সহজেই রক্তদাতা খুঁজে পান এবং দ্রুত যোগাযোগ করুন।"
        />

        <link rel="canonical" href="https://www.roktodata.online/" />
      </Helmet>

      {/* SEO visible content */}
      <h1 style={{ display: "none" }}>
        Blood Donor List Kaliganj
      </h1>

      <div className="bg-red-50">
        <HeroSection />
        <DonorsList />
      </div>
    </>
  )
}

export default Home