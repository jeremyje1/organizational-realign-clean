import React, { useState } from 'react';
import type { Role, RoleTag } from '@/types/types';

import { Select, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface OrgEditorProps {
  initialRoles?: Role[];
  onChange: (_roles: Role[]) => void;
}

const TAGS: RoleTag[] = ['critical', 'nice-to-have', 'optional'];

export default function OrgEditor({
  initialRoles = [],
  onChange,
}: OrgEditorProps) {
  const [roleList, setRoleList] = useState<Role[]>(initialRoles);

  const updateRole = <K extends keyof Role>(
    idx: number,
    key: K,
    value: Role[K],
  ) => {
    setRoleList((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      onChange(next);
      return next;
    });
  };

  const addRole = () =>
    setRoleList((prev) => {
      const newRole: Role = {
        id: crypto.randomUUID(),
        name: '',
        tag: 'optional' as RoleTag,
      };
      const next: Role[] = [...prev, newRole];
      onChange(next);
      return next;
    });

  return (
    <div className="space-y-4">
      {roleList.map((role, idx) => (
        <div key={role.id} className="flex items-center gap-4">
          <input
            className="flex-1 rounded border px-3 py-2"
            value={role.name}
            placeholder="Role title"
            onChange={(e) => updateRole(idx, 'name', e.target.value)}
          />

          <Select
            value={role.tag}
            onValueChange={(v) => updateRole(idx, 'tag', v as RoleTag)}
          >
            <SelectItem value="">Select tag…</SelectItem>
            {TAGS.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </Select>
        </div>
      ))}

      <Button onClick={addRole}>+ Add role</Button>
    </div>
  );
}