import React from 'react';
import EditableContent from './EditableContent';

export default function ReasonContent() {
  return <EditableContent endpoint="/reasonText/1" rows={10} />;
}
