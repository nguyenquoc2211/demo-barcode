'use client'

import React from 'react'

interface Props {
  label: string
  children: React.ReactNode
}

export default function LabeledField({ label, children }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-blue-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}
