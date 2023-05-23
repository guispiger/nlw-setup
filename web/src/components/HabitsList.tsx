import { Check } from 'phosphor-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import dayjs from 'dayjs';

interface HabitsListPorps {
    date: Date;
    onCompletedChanged: (completed: number) => void;
}


interface HabitsInfo {
    possibleHabits: {
        id: string;
        title: string;
        created_at: string; 
    } [],
    completedHabits: string[]
}

export function HabitList({date, onCompletedChanged} : HabitsListPorps) {
    const [habitsInfo, sethabitsInfo] = useState<HabitsInfo>();

    useEffect(() => {
        api.get('/day', {
            params: {
                date: date.toISOString(),
            }
        }).then(response => {
            sethabitsInfo(response.data);
        })
    }, []);

    async function handleToggleHabit(habitId:string) {
        const isHabitAlredyCompleted = habitsInfo!.completedHabits.includes(habitId);
        
        await api.patch(`/habits/${habitId}/toggle`);

        let completedHabits: string[] = [];

        if(isHabitAlredyCompleted){
            completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId);
        }else {
            completedHabits =[...habitsInfo!.completedHabits, habitId]
        };

        sethabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits,
        });

        onCompletedChanged(completedHabits.length);
    };

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());
    
    return (
        <div className='mt-6 flex flex-col gap-3'>
            {habitsInfo?.possibleHabits.map(habit => {
                return(
                    <Checkbox.Root
                    key={habit.id}
                    onCheckedChange={() => handleToggleHabit(habit.id)}
                    checked={habitsInfo.completedHabits.includes(habit.id)}
                    disabled={isDateInPast}
                    className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                    >
                        <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-800 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                            <Checkbox.Indicator>
                                <Check size={20} className='text-white' />
                            </Checkbox.Indicator>
                        </div>
        
                        <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                            {habit.title}
                        </span>
                    </Checkbox.Root>
                )
            })

            }
        </div> 
    )
}