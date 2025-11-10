'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export const description = 'An interactive bar chart';

const chartData = [
    { date: '2024-04-01', desktop: 222, mobile: 150, tablet: 300 },
    { date: '2024-04-02', desktop: 97, mobile: 180, tablet: 300 },
    { date: '2024-04-03', desktop: 167, mobile: 120, tablet: 300 },
    { date: '2024-04-04', desktop: 242, mobile: 260, tablet: 300 },
    { date: '2024-04-05', desktop: 373, mobile: 290, tablet: 300 },
    { date: '2024-04-06', desktop: 301, mobile: 340, tablet: 300 },
    { date: '2024-04-07', desktop: 245, mobile: 180, tablet: 300 },
    { date: '2024-04-08', desktop: 409, mobile: 320, tablet: 300 },
    { date: '2024-04-09', desktop: 59, mobile: 110, tablet: 300 },
    { date: '2024-04-10', desktop: 261, mobile: 190, tablet: 300 },
    { date: '2024-04-11', desktop: 327, mobile: 350, tablet: 300 },
    { date: '2024-04-12', desktop: 292, mobile: 210, tablet: 300 },
    { date: '2024-04-13', desktop: 342, mobile: 380, tablet: 300 },
    { date: '2024-04-14', desktop: 137, mobile: 220, tablet: 300 },
    { date: '2024-04-15', desktop: 120, mobile: 170, tablet: 300 },
    { date: '2024-04-16', desktop: 138, mobile: 190, tablet: 300 },
    { date: '2024-04-17', desktop: 446, mobile: 360, tablet: 300 },
    { date: '2024-04-18', desktop: 364, mobile: 410, tablet: 300 },
    { date: '2024-04-19', desktop: 243, mobile: 180, tablet: 300 },
    { date: '2024-04-20', desktop: 89, mobile: 150, tablet: 300 },
    { date: '2024-04-21', desktop: 137, mobile: 200, tablet: 300 },
    { date: '2024-04-22', desktop: 224, mobile: 170, tablet: 300 },
    { date: '2024-04-23', desktop: 138, mobile: 230, tablet: 300 },
    { date: '2024-04-24', desktop: 387, mobile: 290, tablet: 300 },
    { date: '2024-04-25', desktop: 215, mobile: 250, tablet: 300 },
    { date: '2024-04-26', desktop: 75, mobile: 130, tablet: 300 },
    { date: '2024-04-27', desktop: 383, mobile: 420, tablet: 300 },
    { date: '2024-04-28', desktop: 122, mobile: 180, tablet: 300 },
    { date: '2024-04-29', desktop: 315, mobile: 240, tablet: 300 },
    { date: '2024-04-30', desktop: 454, mobile: 380, tablet: 300 },
    { date: '2024-05-01', desktop: 165, mobile: 220, tablet: 300 },
    { date: '2024-05-02', desktop: 293, mobile: 310, tablet: 300 },
    { date: '2024-05-03', desktop: 247, mobile: 190, tablet: 300 },
    { date: '2024-05-04', desktop: 385, mobile: 420, tablet: 300 },
    { date: '2024-05-05', desktop: 481, mobile: 390, tablet: 300 },
    { date: '2024-05-06', desktop: 498, mobile: 520, tablet: 300 },
    { date: '2024-05-07', desktop: 388, mobile: 300, tablet: 300 },
    { date: '2024-05-08', desktop: 149, mobile: 210, tablet: 300 },
    { date: '2024-05-09', desktop: 227, mobile: 180, tablet: 300 },
    { date: '2024-05-10', desktop: 293, mobile: 330, tablet: 300 },
    { date: '2024-05-11', desktop: 335, mobile: 270, tablet: 300 },
    { date: '2024-05-12', desktop: 197, mobile: 240, tablet: 300 },
    { date: '2024-05-13', desktop: 197, mobile: 160, tablet: 300 },
    { date: '2024-05-14', desktop: 448, mobile: 490, tablet: 300 },
    { date: '2024-05-15', desktop: 473, mobile: 380, tablet: 300 },
    { date: '2024-05-16', desktop: 338, mobile: 400, tablet: 300 },
    { date: '2024-05-17', desktop: 499, mobile: 420, tablet: 300 },
    { date: '2024-05-18', desktop: 315, mobile: 350, tablet: 300 },
    { date: '2024-05-19', desktop: 235, mobile: 180, tablet: 300 },
    { date: '2024-05-20', desktop: 177, mobile: 230, tablet: 300 },
    { date: '2024-05-21', desktop: 82, mobile: 140, tablet: 300 },
    { date: '2024-05-22', desktop: 81, mobile: 120, tablet: 300 },
    { date: '2024-05-23', desktop: 252, mobile: 290, tablet: 300 },
    { date: '2024-05-24', desktop: 294, mobile: 220, tablet: 300 },
    { date: '2024-05-25', desktop: 201, mobile: 250, tablet: 300 },
    { date: '2024-05-26', desktop: 213, mobile: 170, tablet: 300 },
    { date: '2024-05-27', desktop: 420, mobile: 460, tablet: 300 },
    { date: '2024-05-28', desktop: 233, mobile: 190, tablet: 300 },
    { date: '2024-05-29', desktop: 78, mobile: 130, tablet: 300 },
    { date: '2024-05-30', desktop: 340, mobile: 280, tablet: 300 },
    { date: '2024-05-31', desktop: 178, mobile: 230, tablet: 300 },
];

const chartConfig = {
    views: {
        label: 'Page Views',
    },
    tablet: {
        label: 'Tablet',
        color: 'var(--chart-3)',
    },
    desktop: {
        label: 'Desktop',
        color: 'var(--chart-2)',
    },
    mobile: {
        label: 'Mobile',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

export function ChartBarInteractive() {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>('desktop');

    const total = React.useMemo(
        () => ({
            desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
            mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
            tablet: chartData.reduce((acc, curr) => acc + curr.tablet, 0),
        }),
        [],
    );

    return (
        <Card className="h-full py-0">
            <CardHeader className="flex flex-col items-center border-b pt-5 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle>Bar Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing total visitors for the last 3 months
                    </CardDescription>
                </div>
                <div className="relative z-30 w-56 max-w-xs">
                    <Select
                        value={activeChart}
                        onValueChange={(value) =>
                            setActiveChart(value as keyof typeof chartConfig)
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih jenis perangkat" />
                        </SelectTrigger>
                        <SelectContent>
                            {['desktop', 'mobile', 'tablet'].map((key) => {
                                const chart = key as keyof typeof chartConfig;
                                return (
                                    <SelectItem key={chart} value={chart}>
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs text-muted-foreground">
                                                {chartConfig[chart].label}
                                                {': '}
                                                <span className="text-sm font-semibold text-foreground">
                                                    {total[
                                                        key as keyof typeof total
                                                    ].toLocaleString()}
                                                </span>
                                            </span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value,
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        });
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey={activeChart}
                            fill={`var(--color-${activeChart})`}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
