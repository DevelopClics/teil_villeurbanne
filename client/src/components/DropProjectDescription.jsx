import React from 'react';
import EditableContent from './EditableContent';

export default function DropProjectDescription() {
  return <EditableContent endpoint="/dropProjectText/1" rows={20} />;
}
