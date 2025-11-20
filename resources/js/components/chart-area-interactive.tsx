'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
    ChartLegend,
    ChartLegendContent,
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

export const description = 'An interactive area chart';

const chartConfig = {
    visitors: {
        label: 'Visitors',
    },
    desktop: {
        label: 'Desktop',
        color: 'var(--chart-1)',
    },
    mobile: {
        label: 'Mobile',
        color: 'var(--chart-1)',
    },
    tablet: {
        label: 'Tablet',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

export function ChartAreaInteractive({
    chartData,
}: {
    chartData: {
        date: string;
        desktop: number;
        mobile: number;
        tablet: number;
    }[];
}) {
    const [timeRange, setTimeRange] = React.useState('30d');

    const filteredData = React.useMemo(() => {
        if (!chartData || chartData.length === 0) return [];

        const referenceDate = new Date(chartData[chartData.length - 1].date);

        let daysToSubtract = 90;
        if (timeRange === '30d') daysToSubtract = 30;
        if (timeRange === '7d') daysToSubtract = 7;

        const startDate = new Date(referenceDate);
        startDate.setDate(referenceDate.getDate() - daysToSubtract);

        return chartData.filter((item) => {
            const d = new Date(item.date);
            return d >= startDate;
        });
    }, [timeRange, chartData]);

    return (
        <Card className="h-full pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Aktifitas Login Pengguna</CardTitle>
                    <CardDescription>
                        Menunjukan ringkasan data login per-tanggal
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="hidden w-[160px] rounded-lg sm:flex">
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30d">30 hari terakhir</SelectItem>
                        <SelectItem value="7d">7 hari terakhir</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="h-full px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient
                                id="fillDesktop"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>

                            <linearGradient
                                id="fillMobile"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillTablet"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-tablet)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-tablet)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })
                            }
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString(
                                            'en-US',
                                            {
                                                month: 'short',
                                                day: 'numeric',
                                            },
                                        )
                                    }
                                    indicator="dot"
                                />
                            }
                        />

                        <Area
                            dataKey="tablet"
                            type="natural"
                            fill="url(#fillTablet)"
                            stroke="var(--color-tablet)"
                            stackId="a"
                        />
                        <Area
                            dataKey="mobile"
                            type="natural"
                            fill="url(#fillMobile)"
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />

                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
