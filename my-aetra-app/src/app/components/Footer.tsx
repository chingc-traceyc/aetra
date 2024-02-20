export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="container mx-auto">
        <div className="flex flex-wrap pt-8 pb-8">
          <div className="w-full md:w-1/3 text-center text-neutral md:text-left mb-4 md:mb-0 items-center">
            <h1>AETRA</h1>
          </div>
          <div className="w-full md:w-1/3 text-left  mb-4 md:mb-0 text-neutral">
            <h4>Privacy Policy</h4>
            <p>Terms & Conditions</p>
            <p>Shipping & Return Policy</p>
            <p>Contact</p>
          </div>
          <div className="w-full md:w-1/3 text-left text-neutral md:text-right">
            <h4>Connect</h4>
          </div>
        </div>
      </div>
    </footer>
  );
}
