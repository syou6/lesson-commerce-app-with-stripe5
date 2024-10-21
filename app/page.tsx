import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle ,
} from "@/components/ui/card";
import { Database } from "@/lib/database.types";

export const dynamic = 'force-dynamic'

const supabase = createServerComponentClient<Database>({ cookies });

const getAllLessons = async () => {
  const { data: lessons } = await supabase.from("lesson").select("*");
  return lessons;
};

export default async function Home() {
  const lessons = await getAllLessons();
 
  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      <div className="flex flex-col gap-4">
        {lessons?.map((lesson) => (
          <Link href={`/${lesson.id}`} key={lesson.id}>
            <Card>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{lesson.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}


// import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
// import Link from "next/link";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { supabaseServer } from "@/utils/supabaseServer";
// import { Database } from "@/lib/database.types";

// const getAllLessons = async (supabase: SupabaseClient<Database>) => {
//   const { data: lessons } = await supabase.from("lesson").select("*");
//   return lessons;
// };

// export default async function Home() {
//   const supabase = supabaseServer();
//   const lessons = await getAllLessons(supabase);

//   return (
//     <main className="w-full max-w-3xl mx-auto my-16 px-2">
//       <div className="flex flex-col gap-4">
//         {lessons?.map((lesson) => (
//           <Link href={`/${lesson.id}`} key={lesson.id}>
//             <Card>
//               <CardHeader>
//                 <CardTitle>{lesson.title}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>{lesson.description}</p>
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </main>
//   );
// }