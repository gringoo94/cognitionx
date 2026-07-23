import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Observation, todayISO, uid } from "@/lib/dayPlanner";

interface Props {
  observations: Observation[];
  onChange: (next: Observation[]) => void;
}

const emptyDraft = () => ({
  date: todayISO(),
  time: "",
  action: "",
  energy: 5,
  pleasure: 5,
  mastery: 5,
});

const ObservationLog = ({ observations, onChange }: Props) => {
  const [draft, setDraft] = useState(emptyDraft());

  const add = () => {
    if (!draft.action.trim()) return;
    const entry: Observation = { id: uid(), ...draft };
    onChange([entry, ...observations]);
    setDraft(emptyDraft());
  };

  const remove = (id: string) => {
    onChange(observations.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Один-два дня кратко отмечайте, что вы делали и как это повлияло на энергию,
          удовольствие и чувство результата. Не нужно фиксировать каждый час —
          достаточно нескольких точек.
        </p>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Добавить запись</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="col-span-1">
            <Label className="text-xs text-muted-foreground">Дата</Label>
            <Input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
          </div>
          <div className="col-span-1">
            <Label className="text-xs text-muted-foreground">Время</Label>
            <Input
              type="time"
              value={draft.time}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
            />
          </div>
          <div className="col-span-2 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Действие</Label>
            <Input
              placeholder="Например: принял душ"
              value={draft.action}
              onChange={(e) => setDraft({ ...draft, action: e.target.value })}
            />
          </div>
          {(["energy", "pleasure", "mastery"] as const).map((k) => (
            <div key={k} className="col-span-2 md:col-span-2 grid grid-cols-3 gap-2 md:col-span-2 md:flex md:gap-3">
              {(k === "energy") && (
                <div className="col-span-1 md:flex-1">
                  <Label className="text-xs text-muted-foreground">Энергия 0–10</Label>
                  <Input
                    type="number" min={0} max={10}
                    value={draft.energy}
                    onChange={(e) => setDraft({ ...draft, energy: Number(e.target.value) })}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Энергия 0–10</Label>
            <Input
              type="number" min={0} max={10}
              value={draft.energy}
              onChange={(e) => setDraft({ ...draft, energy: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Удовольствие 0–10</Label>
            <Input
              type="number" min={0} max={10}
              value={draft.pleasure}
              onChange={(e) => setDraft({ ...draft, pleasure: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Результат 0–10</Label>
            <Input
              type="number" min={0} max={10}
              value={draft.mastery}
              onChange={(e) => setDraft({ ...draft, mastery: Number(e.target.value) })}
            />
          </div>
        </div>
        <Button onClick={add} disabled={!draft.action.trim()} className="gap-2">
          <Plus className="w-4 h-4" /> Добавить запись
        </Button>
      </div>

      {observations.length === 0 ? (
        <p className="text-sm text-muted-foreground italic px-1">
          Пока нет записей. Добавьте 3–5 наблюдений за день — этого достаточно.
        </p>
      ) : (
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">Дата</TableHead>
                <TableHead className="w-[80px]">Время</TableHead>
                <TableHead>Действие</TableHead>
                <TableHead className="text-right w-[80px]">Энерг.</TableHead>
                <TableHead className="text-right w-[100px]">Удовол.</TableHead>
                <TableHead className="text-right w-[100px]">Результ.</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {observations.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="text-xs text-muted-foreground">{o.date}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{o.time || "—"}</TableCell>
                  <TableCell className="text-sm">{o.action}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{o.energy}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{o.pleasure}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{o.mastery}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => remove(o.id)}
                      aria-label="Удалить"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ObservationLog;
