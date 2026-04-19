# Read the file with UTF-16 encoding
with open('project.html', 'r', encoding='utf-16') as f:
    content = f.read()

# Find the end of the project grid - look for the next section
# We need to find where the current project grid ends
# Let's look for the trace section that follows

old_trace_section = '''<section class="py-16 md:py-20 px-4 md:px-8 bg-[#171212] text-white">
        <div class="max-w-screen-2xl mx-auto">
          <div class="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-8">
            <div
              class="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8"
            >
              <p
                class="text-[10px] uppercase tracking-[0.28em] text-white/55 font-bold mb-4"
              >
                Traceability Example
              </p>'''

# We need to insert the ongoing projects BEFORE this section
# Find where to insert

ong_projects = '''      <!-- ONGOING PROJECTS SECTION -->
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
                src="images/project/provenance%20land%20worli%20mumbai.webp"
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
                src="images/project/rajesh%20vista%20nibm%20mahammedwadi%20pune.webp"
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
                src="images/project/solitare%20world%20kothrud%20pune.webp"
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
                src="images/project/omicron%20f5%20business%20landmark%20baner.webp"
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
                src="images/project/wyce%20exclucity%20bhavdhan%20pune.webp"
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

if old_trace_section in content:
    content = content.replace(old_trace_section, ong_projects + old_trace_section, 1)
    print("Ongoing projects section added!")

    # Write the file back
    with open('project.html', 'w', encoding='utf-16') as f:
        f.write(content)
    print("File saved!")
else:
    print("Trace section not found!")