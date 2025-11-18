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

export function ChartBarInteractive({
    chartData,
}: {
    chartData: {
        date: string;
        desktop: number;
        mobile: number;
        tablet: number;
    }[];
}) {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>('desktop');

    const total = React.useMemo(
        () => ({
            desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
            mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
            tablet: chartData.reduce((acc, curr) => acc + curr.tablet, 0),
        }),
        [chartData],
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
