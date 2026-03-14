interface Props {
  coverage: number
}

export default function CoverageMeter({ coverage }: Props) {

  return (
    <div className="flex items-center gap-3">

      <div className="w-40 bg-muted h-2 rounded overflow-hidden">

        <div
          className="bg-green-500 h-2"
          style={{ width: `${coverage}%` }}
        />

      </div>

      <span className="text-xs font-mono">
        {coverage}%
      </span>

    </div>
  )
}