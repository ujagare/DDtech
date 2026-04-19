with open('project.html', 'r', encoding='utf-16') as f:
    content = f.read()

# Find where to insert - before the trace section
insert_point = content.find('<section class="py-16 md:py-20 px-4 md:px-8 bg-[#171212]')

# Ongoing Projects section to add back
ong_section = '''      <!-- ONGOING PROJECTS SECTION -->
      <section class="py-20 px-8 bg-white">
        <div class="max-w-screen-2xl mx-auto">
          <div
            class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
          >
            <div>
              <p
                class="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-4"
              >
                Ongoing Projects
              </p>
              <h2
                class="project-section-heading font-headline text-4xl md:text-5xl font-black tracking-tighter"
              >
                Currently Executing Projects
              </h2>
            </div>
            <p
              class="project-section-subtext max-w-2xl text-secondary text-lg leading-relaxed"
            >
              Currently ongoing projects with active rebar coupler installations.
            </p>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="Provenance Land Worli Mumbai"
                class="h-64 w-full object-cover"
                src="images/project/provenance land worli mumbai.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Provenance Land
                </h3>
                <p class="text-secondary text-sm mt-2">Worli, Mumbai</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="RAHEJA VISTA NIBM MAHAMMEDWADI PUNE"
                class="h-64 w-full object-cover"
                src="images/project/rajesh vista nibm mahammedwadi pune.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Raheja Vista
                </h3>
                <p class="text-secondary text-sm mt-2">NIBM, Mohammedwadi, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="SOLITAIRE WORLD KOTHARUD PUNE"
                class="h-64 w-full object-cover"
                src="images/project/solitare world kothrud pune.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Solitaire World
                </h3>
                <p class="text-secondary text-sm mt-2">Kotharud, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="OMICRON F5 BUSINESS LANDMARK BANER PUNE"
                class="h-64 w-full object-cover"
                src="images/project/omicron f5 business landmark baner.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Omicron F5 Business Landmark
                </h3>
                <p class="text-secondary text-sm mt-2">Baner, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="WYCE EXCLUCITY BHAVDHAN PUNE"
                class="h-64 w-full object-cover"
                src="images/project/wyce exclucity bhavdhan pune.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Wyce Exclucity
                </h3>
                <p class="text-secondary text-sm mt-2">Bhavdhan, Pune</p>
              </div>
            </article>
          </div>
        </div>
      </section>

'''

if insert_point > 0:
    content = content[:insert_point] + ong_section + content[insert_point:]
    print("Ongoing Projects section restored!")

    with open('project.html', 'w', encoding='utf-16') as f:
        f.write(content)
    print("Saved!")
else:
    print("Could not find insert point")