<?php

namespace Database\Seeders;

use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'prd_name' => 'Cupang Halfmoon Grade A',
                'prd_description' => 'Ikan cupang Halfmoon dengan sirip simetris 180°, warna solid dan aktif. Cocok untuk hobiis pemula maupun kolektor.',
                'prd_price' => 150000,
                'prd_weight' => 120,
            ],
            [
                'prd_name' => 'Cupang Koi Galaxy Premium',
                'prd_description' => 'Varian Koi Galaxy dengan corak acak warna merah, putih, dan biru metalik. Sangat diminati kolektor.',
                'prd_price' => 250000,
                'prd_weight' => 130,
            ],
            [
                'prd_name' => 'Cupang Avatar Blue Rim',
                'prd_description' => 'Cupang Avatar dengan warna utama hitam pekat dan garis biru neon di tepi sirip.',
                'prd_price' => 280000,
                'prd_weight' => 125,
            ],
            [
                'prd_name' => 'Cupang Plakat Nemo Candy',
                'prd_description' => 'Plakat Nemo Candy dengan kombinasi warna kontras dan pola unik. Ukuran tubuh proporsional dan sehat.',
                'prd_price' => 180000,
                'prd_weight' => 110,
            ],
            [
                'prd_name' => 'Cupang Giant Plakat Red Dragon',
                'prd_description' => 'Cupang Giant Plakat berukuran besar dengan sisik dan sirip pola Red Dragon yang tegas.',
                'prd_price' => 350000,
                'prd_weight' => 180,
            ],
            [
                'prd_name' => 'Cupang Hellboy Super Red',
                'prd_description' => 'Varian Hellboy dengan warna merah pekat menyala. Kondisi sehat dan aktif.',
                'prd_price' => 200000,
                'prd_weight' => 120,
            ],
            [
                'prd_name' => 'Cupang Black Samurai',
                'prd_description' => 'Varian langka dengan warna hitam solid dan sedikit gradasi silver. Karakter agresif dan tangguh.',
                'prd_price' => 320000,
                'prd_weight' => 140,
            ],
            [
                'prd_name' => 'Cupang Copper Halfmoon',
                'prd_description' => 'Cupang Halfmoon warna copper metalik dengan detail sirip yang tebal dan proporsional.',
                'prd_price' => 170000,
                'prd_weight' => 115,
            ],
            [
                'prd_name' => 'Cupang Dumbo Ear White Platinum',
                'prd_description' => 'Cupang dengan sirip besar seperti telinga gajah, warna putih platinum bersih.',
                'prd_price' => 260000,
                'prd_weight' => 130,
            ],
            [
                'prd_name' => 'Cupang Multicolor Galaxy Plakat',
                'prd_description' => 'Cupang Plakat warna campuran dengan pola galaxy unik dan sangat bervariasi.',
                'prd_price' => 190000,
                'prd_weight' => 115,
            ],
            [
                'prd_name' => 'Cupang Fancy Pastel Halfmoon',
                'prd_description' => 'Cupang Fancy warna pastel lembut dengan sirip Halfmoon simetris. Sangat cocok untuk pajangan akuarium.',
                'prd_price' => 160000,
                'prd_weight' => 120,
            ],
            [
                'prd_name' => 'Cupang Samurai Gold Metallic',
                'prd_description' => 'Cupang varian Samurai dengan warna emas metalik yang kuat. Gerakan agresif dan sehat.',
                'prd_price' => 300000,
                'prd_weight' => 135,
            ],
            [
                'prd_name' => 'Cupang Avatar Black Mamba',
                'prd_description' => 'Jenis Avatar dengan warna hitam pekat dan sentuhan biru neon di area sirip.',
                'prd_price' => 280000,
                'prd_weight' => 130,
            ],
            [
                'prd_name' => 'Cupang Plakat Koi Yellow Galaxy',
                'prd_description' => 'Cupang Galaxy dominan kuning dengan motif koi yang menyala. Varian langka dan banyak dicari.',
                'prd_price' => 240000,
                'prd_weight' => 125,
            ],
            [
                'prd_name' => 'Cupang Blue Rim Fancy',
                'prd_description' => 'Cupang Fancy dengan pola dominan putih dan garis biru tepi sirip yang tajam.',
                'prd_price' => 170000,
                'prd_weight' => 115,
            ],
            [
                'prd_name' => 'Cupang Red Copper Plakat',
                'prd_description' => 'Plakat warna dasar merah dengan pantulan copper metalik yang memukau di bagian sirip.',
                'prd_price' => 210000,
                'prd_weight' => 120,
            ],
            [
                'prd_name' => 'Cupang Purple Orchid Halfmoon',
                'prd_description' => 'Jenis Halfmoon dengan kombinasi warna ungu lembut dan putih seperti bunga anggrek.',
                'prd_price' => 200000,
                'prd_weight' => 125,
            ],
            [
                'prd_name' => 'Cupang Nemo Galaxy Avatar',
                'prd_description' => 'Perpaduan pola Nemo, Galaxy, dan Avatar dalam satu ikan. Corak unik dan sulit ditemukan.',
                'prd_price' => 350000,
                'prd_weight' => 130,
            ],
            [
                'prd_name' => 'Cupang Samurai Black Gold',
                'prd_description' => 'Cupang dengan warna hitam pekat dan pola emas metalik yang kuat. Sangat elegan dan premium.',
                'prd_price' => 320000,
                'prd_weight' => 140,
            ],
            [
                'prd_name' => 'Cupang Green Emerald Halfmoon',
                'prd_description' => 'Cupang Halfmoon dengan warna hijau zamrud yang jarang ditemukan. Ideal untuk kolektor.',
                'prd_price' => 230000,
                'prd_weight' => 120,
            ],

        ];

        foreach ($products as $p) {
            Product::create([
                'prd_name' => $p['prd_name'],
                'prd_slug' => Str::slug($p['prd_name']),
                'prd_img_url' => null,
                'prd_description' => $p['prd_description'],
                'prd_price' => $p['prd_price'],
                'prd_weight' => $p['prd_weight'],
                'prd_status' => '1',
                'prd_selled_at' => null,
                'prd_created_at' => Carbon::now(),
                'prd_updated_at' => Carbon::now(),
                'prd_created_by' => 1,
                'prd_updated_by' => 1,
                'prd_deleted_by' => null,
                'prd_sys_note' => null,
            ]);
        }
    }
}
