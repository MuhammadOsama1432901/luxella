import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  title: string;
  image: string;
}

export default function CategoryCard({
  title,
  image,
}: CategoryCardProps) {
  // Map "New Arrival" category title to matching query parameter name
  const queryParam = encodeURIComponent(title);

  return (
    <Link href={`/shop?category=${queryParam}`} className="group cursor-pointer block">
      <div className="overflow-hidden rounded-full border border-[#D6B97B] p-3 w-40 h-40 sm:w-44 sm:h-44 mx-auto bg-white transition-all duration-300 hover:shadow-md hover:border-black">
        <Image
          src={image}
          alt={title}
          width={170}
          height={170}
          className="rounded-full object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <h3 className="text-center mt-5 text-sm sm:text-base font-bold text-gray-800 group-hover:text-[#C8A96A] transition-colors uppercase tracking-widest">
        {title}
      </h3>

      <p className="text-center text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest group-hover:text-black transition-colors">
        Shop Now
      </p>
    </Link>
  );
}