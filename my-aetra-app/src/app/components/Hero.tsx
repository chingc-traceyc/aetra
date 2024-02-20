import Image from "next/image";

function Hero() {
  return (
    <>
      <div className="hero pt-12 bg-neutral-content">
        <div className="hero-content md:px-0 px-4 max-w-6xl flex-col lg:flex-row-reverse">
          <Image
            className="max-w-sm h-100 object-cover rounded-lg"
            src="https://edobio.com/cdn/shop/products/65.png?v=1681222614&width=1000"
            alt="landing"
            width="1300"
            height="1300"></Image>
          <div>
            <h1 className="text-5xl text-neutral font-bold md:leading-none leading-tight md:mt-0 mt-10">
              tra = tea in Vietnamese{" "}
            </h1>
            <p className="py-2 text-xl text-neutral mt-4 pr-12">
              Vietnamese people enjoy tea in its purest form,
              <br /> without any additional flavorings.
            </p>
          </div>
        </div>
      </div>

      <div className="hero pb-12 bg-neutral-content">
        <div className="hero-content md:px-0 px-4 max-w-6xl flex-col lg:flex-row-reverse">
          <div className="lg:pl-12 md:pl-12">
            <h1 className="text-2xl text-neutral font-bold md:leading-none leading-tight md:mt-0 mt-10">
              Best Seller{" "}
            </h1>
            <p className="py-2 text-xl text-neutral">
              The Inner Beauty series was inspired by regimen and lifestyle from
              the Edo period. By incorporating this series into your daily life,
              you can maximize your body's natural power, supporting yourself
              from the inside out to become a more beautiful and radiant you.
            </p>
          </div>
          <Image
            className="max-w-md h-100 object-cover rounded-lg"
            src="https://edobio.com/cdn/shop/products/85.png?v=1681229546&width=1000"
            alt="landing"
            width="1000"
            height="1000"></Image>
        </div>
      </div>
    </>
  );
}

export default Hero;
