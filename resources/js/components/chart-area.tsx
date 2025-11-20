import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
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
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

export function ChartArea({
    chartData,
}: {
    chartData: { date: string; desktop: number }[];
}) {
    const [timeRange, setTimeRange] = React.useState('30d');

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date();
        let daysToSubtract = timeRange === '7d' ? 7 : 30;
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });

    function formatCurrency(value: number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    }

    return (
        <Card className="w-full pt-0">
            <CardHeader className="flex items-center gap-2 border-b py-5">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Pendapatan Bulan Ini</CardTitle>
                    <CardDescription>
                        Menunjukan ringkasan data pendapatan per-tanggal
                    </CardDescription>
                </div>

                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30d">30 hari terakhir</SelectItem>
                        <SelectItem value="7d">7 hari terakhir</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={{
                        desktop: {
                            label: 'Pendapatan:',
                            color: 'var(--chart-1)',
                        },
                    }}
                    className="h-[250px] w-full"
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
                                    formatter={(value: any) =>
                                        formatCurrency(Number(value))
                                    }
                                    indicator="dot"
                                />
                            }
                        />

                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
