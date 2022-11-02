import React, { useState } from 'react';

function PlansPanel() {

  const [annual, setAnnual] = useState(true);

  return (
    <div className="grow">

     {/* Panel body */}
      <div className="p-6 space-y-6">

       {/* Plans */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl text-slate-800 font-bold mb-4">Support</h2>
            <div className="text-sm">This Support page gives information on who to contact for any issues encountered during your experience.</div>
          </div>

         {/* Pricing */}
          <div>
           {/* Toggle switch */}
            
           {/* Pricing tabs */}
            <div className="grid grid-cols-12 gap-6">
             {/* Tab 1 */}
              <div className="relative col-span-full xl:col-span-4 bg-white shadow-md rounded-sm border border-slate-200">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500" aria-hidden="true"></div>
                <div className="px-5 pt-5 pb-6 border-b border-slate-200">
                  <header className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full shrink-0 bg-gradient-to-tr from-emerald-500 to-emerald-300 mr-3">
                      <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                      </svg>
                    </div>
                    <h3 className="text-lg text-slate-800 font-semibold">Development Team</h3>
                  </header>
                  <div className="text-sm mb-2">Ideal for individuals that are experiencing bugs or errors in the system.</div>
                 
                 
                 {/* CTA */}
                  
                </div>
                <div className="px-5 pt-4 pb-5">
                  <div className="text-xs text-slate-800 font-semibold uppercase mb-4">Avaliable Email Address:</div>
                 {/* List */}
                  <ul>
                    
                    <li className="flex items-center py-1">
                      
                      <div className="text-sm">Jason@convergenc3.com</div>
                    </li>
                   
                    
                  </ul>
                </div>
              </div>
             {/* Tab 2 */}
              <div className="relative col-span-full xl:col-span-4 bg-white shadow-md rounded-sm border border-slate-200">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-sky-500" aria-hidden="true"></div>
                <div className="px-5 pt-5 pb-6 border-b border-slate-200">
                  <header className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full shrink-0 bg-gradient-to-tr from-sky-500 to-sky-300 mr-3">
                      <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                      </svg>
                    </div>
                    <h3 className="text-lg text-slate-800 font-semibold">Admin</h3>
                  </header>
                  <div className="text-sm mb-2">Ideal for individuals that would like to find out more information about specific services provided in C3 Portal.</div>
                 {/* Price */}
                 
                 {/* CTA */}
                  
                </div>
                <div className="px-5 pt-4 pb-5">
                  <div className="text-xs text-slate-800 font-semibold uppercase mb-4">Available Email Address:</div>
                 {/* List */}
                  <ul>
                    <li className="flex items-center py-1">
                     
                      <div className="text-sm">Monique@convergenc3.com</div>
                    </li>
                    
                    
                  </ul>
                </div>
              </div>
             
              
              
            </div>
          </div>
        </section>

     

     
       

      </div>

     

    </div>
  );
}

export default PlansPanel;