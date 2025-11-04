// components/FleetCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/lib/booqable";
import { productUrl } from "@/lib/booqable";

export default function FleetCard({ car }: { car: Car }) {
  // Standardized padding for consistent car image sizes
  const getPadding = () => {
    return "p-2 sm:p-3";
  };

  return (
    <article className="group rounded-xl sm:rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 mx-2 sm:mx-0">
      <div className="relative aspect-[4/3] bg-gray-50">
        <Image 
          src={car.image} 
          alt={car.name} 
          fill 
          className={`object-contain ${getPadding()}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1">{car.name}</h3>
        {car.priceFrom != null && (
          <p className="mt-1 text-gray-500 text-sm">
            from <span className="text-gray-900 font-bold text-lg sm:text-xl">${car.priceFrom}</span> /day
          </p>
        )}
        {car.features?.length ? (
          <ul className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 text-sm text-gray-600">
            {car.features.map((f) => (
              <li key={f} className="rounded-full bg-gray-100 px-2 sm:px-3 py-1 text-xs font-medium">{f}</li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <Link 
            href={productUrl(car.id)} 
            className="rounded-lg sm:rounded-xl bg-red-600 text-white text-center font-semibold py-3 sm:py-2.5 text-sm sm:text-base hover:bg-red-700 transition-colors duration-200 min-h-[44px] flex items-center justify-center"
            data-analytics="reserve_now"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reserve now
          </Link>
          <Link 
            href={productUrl(car.id)} 
            className="rounded-lg sm:rounded-xl border border-gray-300 text-center font-semibold py-3 sm:py-2.5 text-sm sm:text-base hover:border-red-600 hover:text-red-600 transition-colors duration-200 min-h-[44px] flex items-center justify-center"
            data-analytics="view_details"
            target="_blank"
            rel="noopener noreferrer"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
