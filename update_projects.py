import re

# Read the file with UTF-16 encoding
with open('project.html', 'r', encoding='utf-16') as f:
    content = f.read()

# Find the project section start
old_text = '''<section class="py-20 px-8 bg-white">
        <div class="max-w-screen-2xl mx-auto">
          <div
            class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
          >
            <div>
              <p
                class="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-4"
              >
                Project Portfolio
              </p>
              <h2
                class="project-section-heading font-headline text-4xl md:text-5xl font-black tracking-tighter"
              >
                All Project References
              </h2>
            </div>
            <p
              class="project-section-subtext max-w-2xl text-secondary text-lg leading-relaxed"
            >
              All available project images from your `images/project` folder are
              listed below.
            </p>
          </div>
          <div'''

# COMPLETED PROJECTS section
new_completed_section = '''<section class="py-20 px-8 bg-white">
        <div class="max-w-screen-2xl mx-auto">
          <div
            class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
          >
            <div>
              <p
                class="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-4"
              >
                Completed Projects
              </p>
              <h2
                class="project-section-heading font-headline text-4xl md:text-5xl font-black tracking-tighter"
              >
                Successfully Executed Projects
              </h2>
            </div>
            <p
              class="project-section-subtext max-w-2xl text-secondary text-lg leading-relaxed"
            >
              Successfully completed projects with rebar coupler installations across Pune and Mumbai.
            </p>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="Panchashil Tech Park Viman Nagar Pune"
                class="h-64 w-full object-cover"
                src="images/project/panchashil%20tech%20park%20viman%20nagar%20pune.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Panchashil Tech Park
                </h3>
                <p class="text-secondary text-sm mt-2">Viman Nagar, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="EON WEST LP II WAKAD PUNE"
                class="h-64 w-full object-cover"
                src="images/project/EON%20WEST%20LP%20II,%20WAKAD%20,PUNE.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  EON West LP II
                </h3>
                <p class="text-secondary text-sm mt-2">Wakad, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="GOLDEN BELL MUNDHAWA PUNE"
                class="h-64 w-full object-cover"
                src="images/project/GOLDEN%20BELL.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Golden Bell
                </h3>
                <p class="text-secondary text-sm mt-2">Mundhawa, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="OFFICE BUILDING KALYANI NAGAR PUNE"
                class="h-64 w-full object-cover"
                src="images/project/office%20building%20kalyani%20naga.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Office Building
                </h3>
                <p class="text-secondary text-sm mt-2">Kalyani Nagar, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="KALPATARU JADE RESIDENCES BANER PUNE"
                class="h-64 w-full object-cover"
                src="images/project/kalpatu.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Kalpataru Jade Residences
                </h3>
                <p class="text-secondary text-sm mt-2">Baner, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="43 PRIVATE DRIVE BALEWADI PUNE"
                class="h-64 w-full object-cover"
                src="images/project/43%20private%20dirve%20balewadi%20pune.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  43 Private Drive
                </h3>
                <p class="text-secondary text-sm mt-2">Balewadi, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="SOLITAIRE BUSINESS HUB III BANER PUNE"
                class="h-64 w-full object-cover"
                src="images/project/solita%20business%20hub%20iii%20baner%20pune.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Solitaire Business Hub III
                </h3>
                <p class="text-secondary text-sm mt-2">Baner, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="GERA COMMERZONE KHARADI PUNE"
                class="h-64 w-full object-cover"
                src="images/project/gera%20commerzone%20kharadi%20pune.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Gera Commerzone
                </h3>
                <p class="text-secondary text-sm mt-2">Kharadi, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="VANTAGE PROJECT KHARADI PUNE"
                class="h-64 w-full object-cover"
                src="images/project/vantage%20project%20kharadi%20pune.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Vantage Project
                </h3>
                <p class="text-secondary text-sm mt-2">Kharadi, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="SOLITAIRE BUSINESS HUB II BANER PUNE"
                class="h-64 w-full object-cover"
                src="images/project/solitaie%20business%20hub%20ii%20baner%20pune.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Solitaire Business Hub II
                </h3>
                <p class="text-secondary text-sm mt-2">Baner, Pune</p>
              </div>
            </article>
            <article
              class="rounded-[1.5rem] overflow-hidden border border-[#ead8d4] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
            >
              <img
                alt="MAPLETREE FERN PROJECT VIKHROLI MUMBAI"
                class="h-64 w-full object-cover"
                src="images/project/mapletree%20fern%20project%20vikhroli%20mumbai.webp"
                loading="lazy"
              />
              <div class="p-5">
                <h3 class="font-headline text-xl font-black tracking-tight">
                  Mapletree Fern Project
                </h3>
                <p class="text-secondary text-sm mt-2">Vikhroli, Mumbai</p>
              </div>
            </article>
          </div>
        </div>
      </section>

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
          <div'''

# Find where the old grid starts and ends to keep the next projects
if old_text in content:
    content = content.replace(old_text, new_completed_section, 1)
    print("Section replaced successfully!")

    # Write the file back
    with open('project.html', 'w', encoding='utf-16') as f:
        f.write(content)
    print("File saved!")
else:
    print("Section not found!")