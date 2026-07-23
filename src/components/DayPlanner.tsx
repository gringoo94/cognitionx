import { useEffect, useState } from "react";
import { Download, Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  type DayPlan,
  type DayPlannerState,
  emptyDay,
  exportJson,
  loadState,
  saveState,
  todayISO,
} from "@/lib/dayPlanner";
import ObservationLog from "./day-planner/ObservationLog";
import PlanForm from "./day-planner/PlanForm";
import ReviewList from "./day-planner/ReviewList";
import HistoryPanel from "./day-planner/HistoryPanel";
import ActivityBank from "./day-planner/ActivityBank";

const DayPlanner = () => {
  const [state, setState] = useState<DayPlannerState>(() => ({
    version: 1,
    observations: [],
    days: {},
    activities: [],
  }));
  const [hydrated, setHydrated] = useState(false);
  const [workingDate, setWorkingDate] = useState<string>(todayISO());
  const [draft, setDraft] = useState<DayPlan>(() => emptyDay(todayISO()));

  // Hydrate from localStorage after mount
  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    const today = todayISO();
    const existing = loaded.days[today];
    setDraft(existing ?? emptyDay(today));
    setWorkingDate(today);
    setHydrated(true);
  }, []);

  const persist = (next: DayPlannerState) => {
    setState(next);
    saveState(next);
  };

  const savePlan = () => {
    const next: DayPlannerState = {
      ...state,
      days: { ...state.days, [draft.date]: { ...draft, updatedAt: Date.now() } },
    };
    persist(next);
    setWorkingDate(draft.date);
    toast({
      title: "План сохранён",
      description: `Данные остались в вашем браузере (${draft.date}).`,
    });
  };

  const setObservations = (observations: DayPlannerState["observations"]) => {
    persist({ ...state, observations });
  };

  const setActivities = (activities: DayPlannerState["activities"]) => {
    persist({ ...state, activities });
  };

  const deleteDay = (date: string) => {
    const days = { ...state.days };
    delete days[date];
    persist({ ...state, days });
    if (draft.date === date) setDraft(emptyDay(todayISO()));
  };

  const handleExport = () => exportJson(state);
  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-end print:hidden">
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" /> Экспорт JSON
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" /> Печать
        </Button>
      </div>

      <Tabs defaultValue="plan" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="observe">Наблюдение</TabsTrigger>
          <TabsTrigger value="bank">Банк активностей</TabsTrigger>
          <TabsTrigger value="plan">План на день</TabsTrigger>
          <TabsTrigger value="review">Отметка после</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
        </TabsList>

        <TabsContent value="observe" className="mt-6">
          <ObservationLog observations={state.observations} onChange={setObservations} />
        </TabsContent>

        <TabsContent value="bank" className="mt-6">
          <ActivityBank activities={state.activities} onChange={setActivities} />
        </TabsContent>

        <TabsContent value="plan" className="mt-6 space-y-6">
          <PlanForm day={draft} onChange={setDraft} starters={state.activities.filter((a) => a.starter)} />
          <div className="flex justify-end">
            <Button onClick={savePlan} className="gap-2">
              <Save className="w-4 h-4" /> Сохранить план
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="review" className="mt-6 space-y-6">
          <PlanFormNote workingDate={workingDate} draftDate={draft.date} />
          <ReviewList day={draft} onChange={setDraft} />
          <div className="flex justify-end">
            <Button onClick={savePlan} className="gap-2">
              <Save className="w-4 h-4" /> Сохранить отметки
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {hydrated && <HistoryPanel state={state} onDeleteDay={deleteDay} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PlanFormNote = ({ workingDate, draftDate }: { workingDate: string; draftDate: string }) => (
  <div className="rounded-lg border border-border/60 bg-card/30 px-4 py-2 text-xs text-muted-foreground">
    Отмечаете день: <span className="font-medium text-foreground">{draftDate}</span>
    {workingDate !== draftDate && (
      <span className="ml-2">(изменения тоже сохранятся под этой датой)</span>
    )}
  </div>
);

export default DayPlanner;
