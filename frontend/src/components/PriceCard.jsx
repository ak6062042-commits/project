export default function PriceCard({
  total
}) {

  return (
    <div className="price-card">

      <p className="price-title">
        Estimated Total
      </p>

      <p className="price-value">
        {total} NOK
      </p>

    </div>
  )
}