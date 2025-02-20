"use client"
import Image from "next/image"

export function PrComponent({prs}:any) {

  return (
    <>
    {prs.map((pr:any) => (
        <div key={`${pr.pullReqDate}-${pr.pullReqMessage}`}>
            <a
                href="#"
                key={pr.pullReqDate}
                className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
                <div className="flex w-full items-center gap-2">
                <Image alt={pr.pullReqAuthorName} src={pr.pullReqAuthorAvtar} width={20} height={20} className="flex-none rounded-full bg-gray-50"></Image>
                <span className="text-sm font-semibold w-2">{pr.pullReqMessage}</span>
                </div>
                <span className="font-medium">{pr.pullReqAuthorName}</span>
            </a>
        </div>
        ))}
    </>
  )
}
